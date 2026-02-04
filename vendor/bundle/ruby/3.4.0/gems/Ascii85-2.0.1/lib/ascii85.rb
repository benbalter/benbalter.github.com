# frozen_string_literal: true

require 'stringio'

#
# Ascii85 is an implementation of Adobe's binary-to-text encoding of the
# same name in pure Ruby.
#
# See http://en.wikipedia.org/wiki/Ascii85 for more information about the
# format.
#
# Author::  Johannes Holzfuß (johannes@holzfuss.name)
# License:: Distributed under the MIT License (see LICENSE file)
#
module Ascii85
  class << self
    EMPTY_STRING  = ''.dup.force_encoding(Encoding::ASCII_8BIT)
    START_MARKER  = '<~'.dup.force_encoding(Encoding::ASCII_8BIT)
    ENDING_MARKER = '~>'.dup.force_encoding(Encoding::ASCII_8BIT)
    LINE_BREAK    = "\n".dup.force_encoding(Encoding::ASCII_8BIT)

    #
    # Encodes the bytes of the given String or IO-like object as Ascii85.
    #
    # @param str_or_io [String, IO] The input to encode
    # @param wrap_lines [Integer, false] The line length for wrapping, or +false+ for no wrapping
    # @param out [IO, nil] An optional IO-like object to write the output to
    #
    # @return [String, IO] The encoded String or the output IO object that was passed in
    #
    # @example Encoding a simple String
    #   Ascii85.encode("Ruby")
    #   # => <~;KZGo~>
    #
    # @example Encoding with line wrapping
    #   Ascii85.encode("Supercalifragilisticexpialidocious", 15)
    #   # => <~;g!%jEarNoBkD
    #   #    BoB5)0rF*),+AU&
    #   #    0.@;KXgDe!L"F`R
    #   #    ~>
    #
    # @example Encoding without line wrapping
    #   Ascii85.encode("Supercalifragilisticexpialidocious", false)
    #   # => <~;g!%jEarNoBkDBoB5)0rF*),+AU&0.@;KXgDe!L"F`R~>
    #
    # @example Encoding from an IO-like object
    #   input = StringIO.new("Ruby")
    #   Ascii85.encode(input)
    #   # => "<~;KZGo~>"
    #
    # @example Encoding to an IO object
    #   output = StringIO.new
    #   Ascii85.encode("Ruby", out: output)
    #   # => output (with "<~;KZGo~>" written to it)
    #
    def encode(str_or_io, wrap_lines = 80, out: nil)
      reader = if io_like?(str_or_io)
                 str_or_io
               else
                 StringIO.new(str_or_io.to_s, 'rb')
               end

      return EMPTY_STRING.dup if reader.eof?

      # Setup buffered Reader and Writers
      bufreader = BufferedReader.new(reader, unencoded_chunk_size)
      bufwriter = BufferedWriter.new(out || StringIO.new(String.new, 'wb'), encoded_chunk_size)
      writer = wrap_lines ? Wrapper.new(bufwriter, wrap_lines) : DummyWrapper.new(bufwriter)

      padding = unfrozen_binary_copy("\0\0\0\0")
      tuplebuf = unfrozen_binary_copy('!!!!!')
      exclamations = unfrozen_binary_copy('!!!!!')
      z = unfrozen_binary_copy('z')

      bufreader.each_chunk do |chunk|
        chunk.unpack('N*').each do |word|
          # Encode each big-endian 32-bit word into a 5-character tuple (except
          # for 0, which encodes to 'z')
          if word.zero?
            writer.write(z)
          else
            word, b0 = word.divmod(85)
            word, b1 = word.divmod(85)
            word, b2 = word.divmod(85)
            word, b3 = word.divmod(85)
            b4 = word

            tuplebuf.setbyte(0, b4 + 33)
            tuplebuf.setbyte(1, b3 + 33)
            tuplebuf.setbyte(2, b2 + 33)
            tuplebuf.setbyte(3, b1 + 33)
            tuplebuf.setbyte(4, b0 + 33)

            writer.write(tuplebuf)
          end
        end

        next if (chunk.bytesize & 0b11).zero?

        # If we have leftover bytes, we need to zero-pad to a multiple of four
        # before converting to a 32-bit word.
        padding_length = (-chunk.bytesize) % 4
        trailing = chunk[-(4 - padding_length)..]
        word = (trailing + padding[0...padding_length]).unpack1('N')

        # Encode the last word and cut off any padding
        if word.zero?
          writer.write(exclamations[0..(4 - padding_length)])
        else
          word, b0 = word.divmod(85)
          word, b1 = word.divmod(85)
          word, b2 = word.divmod(85)
          word, b3 = word.divmod(85)
          b4 = word

          tuplebuf.setbyte(0, b4 + 33)
          tuplebuf.setbyte(1, b3 + 33)
          tuplebuf.setbyte(2, b2 + 33)
          tuplebuf.setbyte(3, b1 + 33)
          tuplebuf.setbyte(4, b0 + 33)

          writer.write(tuplebuf[0..(4 - padding_length)])
        end
      end

      # If no output IO-object was provided, extract the encoded String from the
      # default StringIO writer. We force the encoding to 'ASCII-8BIT' to work
      # around a TruffleRuby bug.
      return writer.finish.io.string.force_encoding(Encoding::ASCII_8BIT) if out.nil?

      # Otherwise we make sure to flush the output writer, and then return it.
      writer.finish.io
    end

    # Searches through a String and extracts the first substring enclosed by '<~' and '~>'.
    #
    # @param str [String] The String to search through
    #
    # @return [String] The extracted substring, or an empty String if no valid delimiters are found
    #
    # @example Extracting Ascii85 content
    #   Ascii85.extract("Foo<~;KZGo~>Bar<~z~>Baz")
    #   # => ";KZGo"
    #
    # @example When no delimiters are found
    #   Ascii85.extract("No delimiters")
    #   # => ""
    #
    # @note This method only accepts a String, not an IO-like object, as the entire input
    #       needs to be available to ensure validity.
    #
    def extract(str)
      input = str.to_s

      # Make sure the delimiter Strings have the correct encoding.
      opening_delim = '<~'.encode(input.encoding)
      closing_delim = '~>'.encode(input.encoding)

      # Get the positions of the opening/closing delimiters. If there is no pair
      # of opening/closing delimiters, return an unfrozen empty String.
      (start_pos = input.index(opening_delim))                or return EMPTY_STRING.dup
      (end_pos   = input.index(closing_delim, start_pos + 2)) or return EMPTY_STRING.dup

      # Get the String inside the delimiter-pair
      input[(start_pos + 2)...end_pos]
    end

    #
    # Searches through a String and decodes the first substring enclosed by '<~' and '~>'.
    #
    # @param str [String] The String containing Ascii85-encoded content
    # @param out [IO, nil] An optional IO-like object to write the output to
    #
    # @return [String, IO] The decoded String (in ASCII-8BIT encoding) or the output IO object (if it was provided)
    #
    # @raise [Ascii85::DecodingError] When malformed input is encountered
    #
    # @example Decoding Ascii85 content
    #   Ascii85.decode("<~;KZGo~>")
    #   # => "Ruby"
    #
    # @example Decoding with multiple Ascii85 blocks present (ignores all but the first)
    #   Ascii85.decode("Foo<~;KZGo~>Bar<~87cURDZ~>Baz")
    #   # => "Ruby"
    #
    # @example When no delimiters are found
    #   Ascii85.decode("No delimiters")
    #   # => ""
    #
    # @example Decoding to an IO object
    #   output = StringIO.new
    #   Ascii85.decode("<~;KZGo~>", out: output)
    #   # => output (with "Ruby" written to it)
    #
    # @note This method only accepts a String, not an IO-like object, as the entire input
    #       needs to be available to ensure validity.
    #
    def decode(str, out: nil)
      decode_raw(extract(str), out: out)
    end

    #
    # Decodes the given raw Ascii85-encoded String or IO-like object.
    #
    # @param str_or_io [String, IO] The Ascii85-encoded input to decode
    # @param out [IO, nil] An optional IO-like object to write the output to
    #
    # @return [String, IO] The decoded String (in ASCII-8BIT encoding) or the output IO object (if it was provided)
    #
    # @raise [Ascii85::DecodingError] When malformed input is encountered
    #
    # @example Decoding a raw Ascii85 String
    #   Ascii85.decode_raw(";KZGo")
    #   # => "Ruby"
    #
    # @example Decoding from an IO-like object
    #   input = StringIO.new(";KZGo")
    #   Ascii85.decode_raw(input)
    #   # => "Ruby"
    #
    # @example Decoding to an IO object
    #   output = StringIO.new
    #   Ascii85.decode_raw(";KZGo", out: output)
    #   # => output (with "Ruby" written to it)
    #
    # @note The input must not be enclosed in '<~' and '~>' delimiters.
    #
    def decode_raw(str_or_io, out: nil)
      reader = if io_like?(str_or_io)
                 str_or_io
               else
                 StringIO.new(str_or_io.to_s, 'rb')
               end

      # Return an unfrozen String on empty input
      return EMPTY_STRING.dup if reader.eof?

      # Setup buffered Reader and Writers
      bufreader = BufferedReader.new(reader, encoded_chunk_size)
      bufwriter = BufferedWriter.new(out || StringIO.new(String.new, 'wb'), unencoded_chunk_size)

      # Populate the lookup table (caches the exponentiation)
      lut = (0..4).map { |count| 85**(4 - count) }

      # Decode
      word   = 0
      count  = 0
      zeroes = unfrozen_binary_copy("\0\0\0\0")
      wordbuf = zeroes.dup

      bufreader.each_chunk do |chunk|
        chunk.each_byte do |c|
          case c.chr
          when ' ', "\t", "\r", "\n", "\f", "\0"
            # Ignore whitespace
            next

          when 'z'
            raise(Ascii85::DecodingError, "Found 'z' inside Ascii85 5-tuple") unless count.zero?

            # Expand z to 0-word
            bufwriter.write(zeroes)

          when '!'..'u'
            # Decode 5 characters into a 4-byte word
            word  += (c - 33) * lut[count]
            count += 1

            if count == 5 && word > 0xffffffff
              raise(Ascii85::DecodingError, "Invalid Ascii85 5-tuple (#{word} >= 2**32)")
            elsif count == 5
              b3 = word & 0xff; word >>= 8
              b2 = word & 0xff; word >>= 8
              b1 = word & 0xff; word >>= 8
              b0 = word

              wordbuf.setbyte(0, b0)
              wordbuf.setbyte(1, b1)
              wordbuf.setbyte(2, b2)
              wordbuf.setbyte(3, b3)

              bufwriter.write(wordbuf)

              word  = 0
              count = 0
            end

          else
            raise(Ascii85::DecodingError, "Illegal character inside Ascii85: #{c.chr.dump}")
          end
        end
      end

      # We're done if all 5-tuples have been consumed
      if count.zero?
        bufwriter.flush
        return out || bufwriter.io.string.force_encoding(Encoding::ASCII_8BIT)
      end

      raise(Ascii85::DecodingError, 'Last 5-tuple consists of single character') if count == 1

      # Finish last, partially decoded 32-bit word
      count -= 1
      word  += lut[count]

      bufwriter.write((word >> 24).chr) if count >= 1
      bufwriter.write(((word >> 16) & 0xff).chr) if count >= 2
      bufwriter.write(((word >> 8) & 0xff).chr) if count == 3
      bufwriter.flush

      out || bufwriter.io.string.force_encoding(Encoding::ASCII_8BIT)
    end

    private

    # Copies the given String and forces the encoding of the returned copy to
    # be Encoding::ASCII_8BIT.
    def unfrozen_binary_copy(str)
      str.dup.force_encoding(Encoding::ASCII_8BIT)
    end

    # Buffers an underlying IO object to increase efficiency. You do not need
    # to use this directly.
    #
    # @private
    #
    class BufferedReader
      def initialize(io, buffer_size)
        @io = io
        @buffer_size = buffer_size
      end

      def each_chunk
        return enum_for(:each_chunk) unless block_given?

        until @io.eof?
          chunk = @io.read(@buffer_size)
          yield chunk if chunk
        end
      end
    end

    # Buffers an underlying IO object to increase efficiency. You do not need
    # to use this directly.
    #
    # @private
    #
    class BufferedWriter
      attr_accessor :io

      def initialize(io, buffer_size)
        @io = io
        @buffer_size = buffer_size
        @buffer = String.new(capacity: buffer_size, encoding: Encoding::ASCII_8BIT)
      end

      def write(tuple)
        flush if @buffer.bytesize + tuple.bytesize > @buffer_size
        @buffer << tuple
      end

      def flush
        @io.write(@buffer)
        @buffer.clear
      end
    end

    # Wraps the input in '<~' and '~>' delimiters and passes it through
    # unmodified to the underlying IO object otherwise. You do not need to
    # use this directly.
    #
    # @private
    #
    class DummyWrapper
      def initialize(out)
        @out = out
        @out.write(START_MARKER)
      end

      def write(buffer)
        @out.write(buffer)
      end

      def finish
        @out.write(ENDING_MARKER)
        @out.flush

        @out
      end
    end

    # Wraps the input in '<~' and '~>' delimiters and ensures that no line is
    # longer than the specified length. You do not need to use this directly.
    #
    # @private
    #
    class Wrapper
      def initialize(out, wrap_lines)
        @line_length = [2, wrap_lines.to_i].max

        @out = out
        @out.write(START_MARKER)

        @cur_len = 2
      end

      def write(buffer)
        loop do
          s = buffer.bytesize

          if @cur_len + s < @line_length
            @out.write(buffer)
            @cur_len += s
            return
          end

          remaining = @line_length - @cur_len
          @out.write(buffer[0...remaining])
          @out.write(LINE_BREAK)
          @cur_len = 0
          buffer = buffer[remaining..]
          return if buffer.empty?
        end
      end

      def finish
        # Add the closing delimiter (may need to be pushed to the next line)
        @out.write(LINE_BREAK) if @cur_len + 2 > @line_length
        @out.write(ENDING_MARKER)

        @out.flush
        @out
      end
    end

    # Check if an object is IO-like
    #
    # @private
    #
    def io_like?(obj)
      obj.respond_to?(:read) &&
        obj.respond_to?(:eof?)
    end

    # @return [Integer] Buffer size for to-be-encoded input
    #
    def unencoded_chunk_size
      4 * 2048
    end

    # @return [Integer] Buffer size for encoded output
    #
    def encoded_chunk_size
      5 * 2048
    end
  end

  #
  # Error raised when Ascii85 encounters problems while decoding the input.
  #
  # This error is raised for the following issues:
  # * An invalid character (valid characters are '!'..'u' and 'z')
  # * A 'z' character inside a 5-tuple ('z' is only valid on its own)
  # * An invalid 5-tuple that decodes to >= 2**32
  # * The last tuple consisting of a single character. Valid tuples always have
  #   at least two characters.
  #
  class DecodingError < StandardError; end
end
