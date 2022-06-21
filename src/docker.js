const { exec } = require('child_process');
const { existsSync } = require('fs');

const dockerSaveCmd = (image, output) => `docker image ls && docker save -o ${output} ${image}`;

const dockerLoadCmd = (input) => `docker load -i ${input}`;
console.log(`hey2`);
/**
 * 
 * @param {string} image 
 * @param {string} output 
 */
exports.packageImage = async function(image, output) {
    return await new Promise((resolve, reject) => {
        exec(dockerSaveCmd(image, output), {maxBuffer: 512 * 1024 * 1024}, (err, _, stdErr) => {
            error = err || stdErr;
            if (error) {
                reject(`i dunno why ${error}`);
            } else {
                resolve(output);
            }
        });
    });
}

/**
 * 
 * @param {string} input 
 */
exports.loadImage = async function(input) {
    if (!existsSync(input)){
        throw new Error(`Docker load image failed - image input path does not exist: ${input}`);
    }

    return await new Promise((resolve, reject) => {
        exec(dockerLoadCmd(input), {maxBuffer: 512 * 1024 * 1024}, (err, _, stdErr) => {
            error = err || stdErr;
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}
