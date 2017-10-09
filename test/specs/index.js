import { emptyDirSync, readFileSync } from 'fs-extra'
import { join } from 'path'
import transpileFiles from '../../index.js'

const testFiles = join('test', 'files')
const src = join(testFiles, 'src')
const dest = join(testFiles, 'dist')
const babelConfig = {
    presets: [ [ 'env', { targets: { node: 'current' }, debug: true } ] ]
}

describe('transpileFiles()', () => {

    afterEach(() => {
        emptyDirSync(dest)
    })

    it('should transpile all files in a directory', () => {
        transpileFiles({ src, dest: dest + '/', babelConfig })
        const files = [
            'test/files/dist/one.js',
            'test/files/dist/sub/sub/four.js',
            'test/files/dist/sub/three.js',
            'test/files/dist/two.js'
        ]

        files.forEach((file) => {
            expect(
                readFileSync(join(process.cwd(), file), 'utf8')
                .includes('use strict')
            )
            .toBe(true)
        })
    })

    it('should produce source maps for all files in a directory', () => {
        const configWithSourceMap = { ...babelConfig, sourceMap: true }
        transpileFiles({ src, dest, babelConfig: configWithSourceMap })
        const files = [
            'test/files/dist/one.js.map',
            'test/files/dist/sub/sub/four.js.map',
            'test/files/dist/sub/three.js.map',
            'test/files/dist/two.js.map'
        ]
        files.forEach((file) => {
            expect(
                readFileSync(join(process.cwd(), file), 'utf8').includes('{')
            )
            .toBe(true)
        })
    })
})
