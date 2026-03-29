const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Advanced Node.js Technique: Using child_process.exec + temp files
 * to safely run student-submitted JavaScript code and capture output/errors.
 */
const runCode = (code, inputData) => {
    return new Promise((resolve) => {
        // Wrap code so it reads from process.argv
        const wrappedCode = `
const _input = ${JSON.stringify(inputData)};
process.argv.push(_input);
${code}
`;
        const tmpFile = path.join(__dirname, `../../tmp_${Date.now()}.js`);
        fs.writeFileSync(tmpFile, wrappedCode);

        exec(`node "${tmpFile}"`, { timeout: 5000 }, (error, stdout, stderr) => {
            fs.unlinkSync(tmpFile); // Cleanup temp file
            if (error || stderr) {
                resolve({ success: false, output: '', error: stderr || error.message });
            } else {
                resolve({ success: true, output: stdout.trim(), error: null });
            }
        });
    });
};

module.exports = { runCode };
