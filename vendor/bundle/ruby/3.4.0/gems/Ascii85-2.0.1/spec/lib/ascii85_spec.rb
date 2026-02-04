# frozen_string_literal: true

require 'minitest/autorun'
require 'stringio'

# Require implementation
require File.expand_path('../../lib/ascii85', __dir__)

TEST_CASES = {
  '' => '',
  ' ' => '<~+9~>',

  "\0" * 1 => '<~!!~>',
  "\0" * 2 => '<~!!!~>',
  "\0" * 3 => '<~!!!!~>',
  "\0" * 4 => '<~z~>',
  "\0" * 5 => '<~z!!~>',
  "A\0\0\0\0" => '<~5l^lb!!~>', # No z-abbreviation!

  'A' => '<~5l~>',
  'AB' => '<~5sb~>',
  'ABC' => '<~5sdp~>',
  'ABCD' => '<~5sdq,~>',
  'ABCDE' => '<~5sdq,70~>',
  'ABCDEF' => '<~5sdq,77I~>',
  'ABCDEFG' => '<~5sdq,77Kc~>',
  'ABCDEFGH' => '<~5sdq,77Kd<~>',
  'ABCDEFGHI' => '<~5sdq,77Kd<8H~>',
  'Ascii85' => '<~6$$OMBfIs~>',

  'Antidisestablishmentarianism' => '<~6#LdYA8-*rF*(i"Ch[s(D.RU,@<-\'jDJ=0/~>',

  # Dōmo arigatō, Mr. Roboto (according to Wikipedia)
  'どうもありがとうミスターロボット' =>
      '<~j+42iJVN3:K&_E6j+<0KJW/W?W8iG`j+EuaK"9on^Z0sZj+FJoK:LtSKB%T?~>',

  [Math::PI].pack('G') => '<~5RAV2<(&;T~>',
  [Math::E].pack('G') => '<~5R"n0M\\K6,~>',

  # Minified example from Github issue 8.
  # Note that OT and OU as the trailing characters are equivalent.
  "\x9B\xB6\xB9+\x91" => '<~S$ojXOT~>'
}.freeze

describe Ascii85 do
  it '#decode should be the inverse of #encode' do
    # Generate a test string that contains all possible bytes
    test_str = String.new
    (0..255).each do |c|
      test_str << c.chr
    end

    encoded = Ascii85.encode(test_str)
    decoded = Ascii85.decode(encoded)

    assert_equal test_str, decoded
  end

  describe '#encode' do
    it 'should encode all specified test-cases correctly' do
      TEST_CASES.each_pair do |input, encoded|
        assert_equal encoded, Ascii85.encode(input)
      end
    end

    it 'should always return unfrozen Strings' do
      TEST_CASES.each_pair do |input, encoded|
        assert_equal false, Ascii85.encode(input).frozen?
      end
    end

    it 'should encode Strings in different encodings correctly' do
      input_euc_jp = 'どうもありがとうミスターロボット'.encode('EUC-JP')
      input_binary = input_euc_jp.force_encoding('ASCII-8BIT')

      assert_equal Ascii85.encode(input_binary), Ascii85.encode(input_euc_jp)
    end

    it 'should produce output lines no longer than specified' do
      test_str = '0123456789' * 30

      #
      # No wrap
      #
      assert_equal 0, Ascii85.encode(test_str, false).count("\n")

      #
      # x characters per line, except for the last one
      #
      (2..12).each do |x|
        encoded = Ascii85.encode(test_str, x)

        # Determine the length of all lines
        count_arr = []
        encoded.each_line do |line|
          count_arr << line.chomp.length
        end

        # The last line is allowed to be shorter than x, so remove it
        count_arr.pop if count_arr.last <= x

        # If the end-marker is on a line of its own, the next-to-last line is
        # allowed to be shorter than specified by exactly one character
        count_arr.pop if (encoded[-3].chr =~ /[\r\n]/) && (count_arr.last == x - 1)

        # Remove all line-lengths that are of length x from count_arr
        count_arr.delete_if { |len| len == x }

        # Now count_arr should be empty
        assert_empty count_arr
      end
    end

    it 'should not split the end-marker to achieve correct line length' do
      assert_equal "<~z\n~>", Ascii85.encode("\0" * 4, 4)
    end

    it 'should encode to an IO object when provided' do
      output = StringIO.new
      result = Ascii85.encode('Ruby', out: output)
      assert_equal output, result
      assert_equal '<~;KZGo~>', output.string
    end

    it 'should encode from an IO object' do
      input = StringIO.new('Ruby')
      result = Ascii85.encode(input)
      assert_equal '<~;KZGo~>', result
    end
  end

  describe '#extract' do
    it 'should extract data within delimiters only' do
      assert_empty Ascii85.extract('<~~>')
      assert_empty Ascii85.extract("Doesn't contain delimiters")
      assert_empty Ascii85.extract('Mismatched ~>   delimiters 1')
      assert_empty Ascii85.extract('Mismatched <~   delimiters 2')
      assert_empty Ascii85.extract('Mismatched ~><~ delimiters 3')

      assert_equal ';KZGo', Ascii85.extract('<~;KZGo~><~z~>')
      assert_equal 'z',     Ascii85.extract('FooBar<~z~>BazQux')
    end
  end

  describe '#decode' do
    it 'should decode all specified test-cases correctly' do
      TEST_CASES.each_pair do |decoded, input|
        assert_equal decoded.dup.force_encoding('ASCII-8BIT'), Ascii85.decode(input)
      end
    end

    it 'should always return unfrozen Strings' do
      TEST_CASES.each_pair do |input, encoded|
        assert_equal false, Ascii85.decode(encoded).frozen?
      end
    end

    it 'should accept valid input in encodings other than the default' do
      input = 'Ragnarök  τέχνη  русский язык  I ♥ Ruby'
      input_ascii85 = Ascii85.encode(input)

      # Try to encode input_ascii85 in all possible encodings and see if we
      # do the right thing in #decode.
      Encoding.list.each do |encoding|
        next if encoding.dummy?
        next unless encoding.ascii_compatible?

        # CP949 is a Microsoft Codepage for Korean, which apparently does not
        # include a backslash, even though #ascii_compatible? returns true. This
        # leads to an Ascii85::DecodingError, so we simply skip the encoding.
        next if encoding.name == 'CP949'

        begin
          to_test = input_ascii85.encode(encoding)
          assert_equal input, Ascii85.decode(to_test).force_encoding('UTF-8')
        rescue Encoding::ConverterNotFoundError
          # Ignore this encoding
        end
      end
    end

    it 'should only process data within delimiters' do
      assert_empty Ascii85.decode('<~~>')
      assert_empty Ascii85.decode("Doesn't contain delimiters")
      assert_empty Ascii85.decode('Mismatched ~>   delimiters 1')
      assert_empty Ascii85.decode('Mismatched <~   delimiters 2')
      assert_empty Ascii85.decode('Mismatched ~><~ delimiters 3')

      assert_equal 'Ruby',     Ascii85.decode('<~;KZGo~><~z~>')
      assert_equal "\0\0\0\0", Ascii85.decode('FooBar<~z~>BazQux')
    end

    it 'should ignore whitespace' do
      decoded = Ascii85.decode("<~6   #LdYA\r\08\n  \n\n- *rF*(i\"Ch[s \t(D.RU,@ <-\'jDJ=0\f/~>")
      assert_equal 'Antidisestablishmentarianism', decoded
    end

    it 'should return ASCII-8BIT encoded strings' do
      assert_equal 'ASCII-8BIT', Ascii85.decode('<~;KZGo~>').encoding.name
    end

    it 'should decode to an IO object when provided' do
      output = StringIO.new
      result = Ascii85.decode('<~;KZGo~>', out: output)
      assert_equal output, result
      assert_equal 'Ruby', output.string
    end

    describe 'Error conditions' do
      it 'should raise DecodingError if it encounters a word >= 2**32' do
        assert_raises(Ascii85::DecodingError) { Ascii85.decode('<~s8W-#~>') }
      end

      it 'should raise DecodingError if it encounters an invalid character' do
        assert_raises(Ascii85::DecodingError) { Ascii85.decode('<~!!y!!~>') }
      end

      it 'should raise DecodingError if the last tuple consists of a single character' do
        assert_raises(Ascii85::DecodingError) { Ascii85.decode('<~!~>') }
      end

      it 'should raise DecodingError if a z is found inside a 5-tuple' do
        assert_raises(Ascii85::DecodingError) { Ascii85.decode('<~!!z!!~>') }
      end
    end
  end

  describe '#decode_raw' do
    it 'should decode raw Ascii85 without delimiters' do
      TEST_CASES.each_pair do |decoded, input|
        raw_input = input[2...-2] # Remove '<~' and '~>'
        assert_equal decoded.dup.force_encoding('ASCII-8BIT'), Ascii85.decode_raw(raw_input)
      end
    end

    it 'should always return unfrozen Strings' do
      TEST_CASES.each_pair do |decoded, input|
        raw_input = input[2...-2] # Remove '<~' and '~>'
        assert_equal false, Ascii85.decode_raw(raw_input).frozen?
      end
    end

    it 'should decode from an IO object' do
      input = StringIO.new(';KZGo')
      result = Ascii85.decode_raw(input)
      assert_equal 'Ruby', result
    end

    it 'should decode to an IO object when provided' do
      output = StringIO.new
      result = Ascii85.decode_raw(';KZGo', out: output)
      assert_equal output, result
      assert_equal 'Ruby', output.string
    end

    it 'should raise DecodingError for invalid input' do
      assert_raises(Ascii85::DecodingError) { Ascii85.decode_raw('s8W-#') }
      assert_raises(Ascii85::DecodingError) { Ascii85.decode_raw('!!y!!') }
      assert_raises(Ascii85::DecodingError) { Ascii85.decode_raw('!') }
      assert_raises(Ascii85::DecodingError) { Ascii85.decode_raw('!!z!!') }
    end
  end
end
