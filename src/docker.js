const { exec } = require('child_process');
const { existsSync } = require('fs');

const preCmd = () => `docker image ls`;
const dockerSaveCmd = (image, output) => `docker save ${image} -o ${output}`;

const dockerLoadCmd = (input) => `docker load -i ${input}`;
console.log(`hey3`);
/**
 * 
 * @param {string} image 
 * @param {string} output 
 */
exports.packageImage = async function(image, output) {
    await new Promise((resolve, reject) => {
        exec(preCmd(image, output), {maxBuffer: 512 * 1024 * 1024}, (err, _, stdErr) => {
            error = err || stdErr;
            if (error) {
                reject(`rejected1 ${error}`);
            } else {
                console.log(`the output of ls is:`);
                console.log(`we expect image to be ${image}`);
                console.log(`output found is ${output}`);
                console.log(`output modified is ${output.split(':')[0]+':head'}`);
                resolve('resolved1 ',output);
            }
        });
    });
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
