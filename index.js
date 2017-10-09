var fs = require('fs-extra')
var babel = require('babel-core')
var path = require('ethical-utility-path')
var recursiveReadSync = require('recursive-readdir-sync')

var resolveFiles = (files) => {
    return files.filter(file => file.endsWith('.js'))
}

var transpileFiles = ({ src, dest, babelConfig }) => {

    const files = recursiveReadSync(path.absolute(src))
    const resolvedFiles = resolveFiles(files)

    resolvedFiles.forEach(file => {
        var originalSource = fs.readFileSync(file, 'utf8')
        if (babelConfig.sourceMap) {
            babelConfig.sourceFileName = path.relative(file)
        }
        var source = babel.transform(originalSource, babelConfig)
        var newFilename = path.resolveDestPath(file, dest, src)
        fs.ensureFileSync(newFilename)
        fs.writeFileSync(newFilename, source.code)
        if (!source.map) return
        fs.writeFileSync(newFilename + '.map', JSON.stringify(source.map))
    })
}

module.exports = transpileFiles
