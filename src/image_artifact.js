const docker = require('./docker');
const artifact = require('./github_artifact');

const path = require('path');
const os = require('os');

const INVALID_CHARS = /[\s><:"|*?/\\]/g;

const resolvePackageName = (imageName) => imageName.replace(INVALID_CHARS, '_');

const resolveArtifactName = (imageName) => `action_image_artifact_${resolvePackageName(imageName)}`;

/**
 * @param {string} image 
 * 
 * @returns {string} // Uploaded artifact name
 * 
 * Upload a image package as github artifact which is later possible to point to with given image name. 
 * Eg. image "foo:latest" is packaged to a file `foo_latest` and then upload as an artifact with a name 
 *      `image_artifact_foo_latest`. In short we will have an artifact like,
 *             image_artifact_foo_latest[foo_latest]
 */
console.error(`packageimage`);
exports.upload = async function(image) {
    console.log(`image_artifact(1): original image is ${image}`);
    console.log(`image_artifact(2): image is ${image} and resolvePackageName is ${path.join(os.tmpdir(), resolvePackageName(image))}`);
    const packagePath = await docker.packageImage(image, path.join(os.tmpdir(), resolvePackageName(image)));
    
    const artifactName = resolveArtifactName(image);
    console.log(`image_artifact: artifactName is ${artifactName} and package path is ${packagePath}`);
    await artifact.upload(artifactName, packagePath);

    return artifactName;
}

/**
 * @param {string} image  
 * 
 * @returns {string} // Artifact local downloaded path 
 * 
 * For a github artifact to be linked with the given image name, it has to be named in predictable way.
 * Eg. image `foo:latest` packaged as `foo_latest` uploaded as an artifact named `image_artifact_foo_latest`
 *      can be downloaded and loaded with ${downloadDir}/${packageName} i.e /tmp/foo_latest
 */
exports.download = async function(image) {
    const downloadDir = await artifact.download(resolveArtifactName(image), os.tmpdir());
    
    const imagePackageName = resolvePackageName(image);    
    await docker.loadImage(path.join(downloadDir, imagePackageName));  

    return path.join(downloadDir, imagePackageName);
}