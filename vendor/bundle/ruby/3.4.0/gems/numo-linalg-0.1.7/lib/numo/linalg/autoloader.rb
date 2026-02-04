require 'fiddle'
require 'rbconfig'
require 'numo/linalg/linalg'

module Numo
  module Linalg
    module Autoloader

      @@libs = nil

      module_function

      def libs
        @@libs
      end

      # Load backend libraries for Numo::Linalg automatically.
      #
      # @return [String] name of loaded backend library (mkl/openblas/lapack)
      def load_library
        mkl_dirs = ['/opt/intel/lib', '/opt/intel/lib64', '/opt/intel/mkl/lib', '/opt/intel/mkl/lib64']
        openblas_dirs = ['/opt/OpenBLAS/lib', '/opt/OpenBLAS/lib64', '/opt/openblas/lib', '/opt/openblas/lib64',
                         '/usr/local/opt/openblas/lib']
        atlas_dirs = ['/opt/atlas/lib', '/opt/atlas/lib64',
                      '/usr/lib/atlas', '/usr/lib64/atlas', '/usr/local/opt/atlas/lib']
        lapacke_dirs = ['/opt/lapack/lib', '/opt/lapack/lib64', '/opt/local/lib/lapack',
                        '/usr/local/opt/lapack/lib']
        opt_dirs =  ['/opt/local/lib', '/opt/local/lib64', '/opt/lib', '/opt/lib64']
        base_dirs = ['/usr/local/lib', '/usr/local/lib64', '/usr/lib', '/usr/lib64']
        base_dirs.concat(Dir["/usr/lib/#{RbConfig::CONFIG['host_cpu']}-*"])
        base_dirs.unshift(*ENV['LD_LIBRARY_PATH'].split(':')) unless ENV['LD_LIBRARY_PATH'].nil?

        select_dirs(base_dirs)
        select_dirs(opt_dirs)
        select_dirs(lapacke_dirs)
        select_dirs(atlas_dirs)
        select_dirs(mkl_dirs)

        mkl_libs = find_mkl_libs([*base_dirs, *opt_dirs, *mkl_dirs])
        openblas_libs = find_openblas_libs([*base_dirs, *opt_dirs, *openblas_dirs])
        atlas_libs = find_atlas_libs([*base_dirs, *opt_dirs, *atlas_dirs, *lapacke_dirs])
        lapack_libs = find_lapack_libs([*base_dirs, *opt_dirs, *lapacke_dirs])

        @@libs = nil
        if !mkl_libs.value?(nil)
          open_mkl_libs(mkl_libs)
          @@libs = mkl_libs.values
          'mkl'
        elsif !openblas_libs.value?(nil)
          open_openblas_libs(openblas_libs)
          @@libs = openblas_libs.values.uniq
          'openblas'
        elsif !atlas_libs.value?(nil)
          open_atlas_libs(atlas_libs)
          @@libs = atlas_libs.values.uniq
          'atlas'
        elsif !lapack_libs.value?(nil)
          open_lapack_libs(lapack_libs)
          @@libs = lapack_libs.values.uniq
          'lapack'
        else
          raise 'cannot find MKL/OpenBLAS/ATLAS/BLAS-LAPACK library'
        end
      end

      def detect_library_extension
        # Ruby >= 2.5 provides SOEXT in rbconfig
        so_ext = RbConfig::CONFIG["SOEXT"]
        return so_ext if so_ext

        return 'dll' if windows?

        # For Ruby < 2.5, we use RUBY_PLATFORM
        case RUBY_PLATFORM
        when /darwin|mac os/
          'dylib'
        else
          'so'
        end
      end

      def windows?
        case RUBY_PLATFORM
        when /mswin|msys|mingw|cygwin/
          true
        else
          false
        end
      end

      def select_dirs(dirs)
        dirs.select!{|d| Dir.exist?(d)}
      end

      def find_libs(lib_names, lib_dirs)
        lib_ext = detect_library_extension
        lib_arr = lib_names.map do |l|
          x = nil
          if windows?
            # On Windows, try to search the default DLL search path at first
            [
              "lib#{l}.#{lib_ext}",
              "lib#{l}64.#{lib_ext}"
            ].each do |filename|
              begin
                Fiddle.dlopen(filename).close
              rescue Fiddle::DLError
                x = nil
              else
                x = filename
                break
              end
            end
          end
          if x.nil?
            # Search in the candidate directories
            lib_dirs.find do |d|
              x = Dir.glob("#{d}/lib#{l}{,64}.#{lib_ext}{,.*}").find do |lib|
                begin
                  Fiddle.dlopen(lib).close
                rescue Fiddle::DLError
                  false
                else
                  true
                end
              end
              break if x
            end
          end
          [l.to_sym, x]
        end
        Hash[*lib_arr.flatten]
      end

      def find_mkl_libs(lib_dirs)
        lib_names = %w[iomp5 mkl_core mkl_intel_thread mkl_intel_lp64]
        find_libs(lib_names, lib_dirs)
      end

      def find_openblas_libs(lib_dirs)
        lib_names = %w[openblas lapacke]
        openblas_libs = find_libs(lib_names, lib_dirs)
        openblas_libs[:lapacke] = openblas_libs[:openblas] if openblas_libs[:lapacke].nil?
        openblas_libs
      end

      def find_atlas_libs(lib_dirs)
        lib_names = %w[tatlas atlas satlas cblas lapacke]
        atlas_libs = find_libs(lib_names, lib_dirs)
        atlas_libs[:atlas] = atlas_libs[:tatlas] unless atlas_libs[:tatlas].nil?
        atlas_libs[:atlas] = atlas_libs[:satlas] if atlas_libs[:atlas].nil?
        atlas_libs[:cblas] = atlas_libs[:atlas] if atlas_libs[:cblas].nil?
        atlas_libs.delete(:tatlas)
        atlas_libs.delete(:satlas)
        atlas_libs
      end

      def find_lapack_libs(lib_dirs)
        lib_names = %w[blas cblas lapack lapacke]
        lapack_libs = find_libs(lib_names, lib_dirs)
        lapack_libs[:cblas] = lapack_libs[:blas] if lapack_libs[:cblas].nil?
        lapack_libs
      end

      def open_mkl_libs(mkl_libs)
        Fiddle.dlopen(mkl_libs[:iomp5])
        Fiddle.dlopen(mkl_libs[:mkl_core])
        Fiddle.dlopen(mkl_libs[:mkl_intel_thread])
        Fiddle.dlopen(mkl_libs[:mkl_intel_lp64])
        Numo::Linalg::Blas.dlopen(mkl_libs[:mkl_intel_lp64])
        Numo::Linalg::Lapack.dlopen(mkl_libs[:mkl_intel_lp64])
      end

      def open_openblas_libs(openblas_libs)
        Numo::Linalg::Blas.dlopen(openblas_libs[:openblas])
        Numo::Linalg::Lapack.dlopen(openblas_libs[:lapacke])
      end

      def open_atlas_libs(atlas_libs)
        Fiddle.dlopen(atlas_libs[:atlas])
        Numo::Linalg::Blas.dlopen(atlas_libs[:cblas])
        Numo::Linalg::Lapack.dlopen(atlas_libs[:lapacke])
      end

      def open_lapack_libs(lapack_libs)
        Fiddle.dlopen(lapack_libs[:blas])
        Fiddle.dlopen(lapack_libs[:lapack])
        Numo::Linalg::Blas.dlopen(lapack_libs[:cblas])
        Numo::Linalg::Lapack.dlopen(lapack_libs[:lapacke])
      end

      private_class_method :detect_library_extension,
                           :find_libs, :find_mkl_libs, :find_openblas_libs, :find_atlas_libs, :find_lapack_libs,
                           :open_mkl_libs, :open_openblas_libs, :open_atlas_libs, :open_lapack_libs
    end
  end
end

Numo::Linalg::Autoloader.load_library
