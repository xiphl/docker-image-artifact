const artifact = require('@actions/artifact');

const path = require('path');
const fs = require('fs');

var artifactClient; 

function getArtifactClient() {
    artifactClient = artifactClient || artifact.create();
    
    return artifactClient;
}

/**
 * @param {string} name 
 * @param {string} file 
 * @param {number} retentionDays // 0 means default value set in github
 */
exports.upload = async function(name, file, retentionDays = 0) {
    if (!fs.existsSync(file)) {
        throw new Error(`Artifact Upload failed: ${name} - File does not exist: ${file}`);
    }

    const uploadResponse = await getArtifactClient().uploadArtifact(
        name, [file], path.dirname(file), { retentionDays: retentionDays }
    );
    
    // there is a failed item
    if (uploadResponse.failedItems.length > 0) {
        throw new Error(`Artifact Upload failed: ${name}`);
    }
    
    return name;
}

/**
 * @param {string} name 
 * @param {string} basedir 
 */
exports.download = async function(name, basedir) {
    if (!fs.existsSync(basedir)) {
        throw new Error(`Artifact Upload failed: ${name} - Directory does not exist: ${basedir}`);
    }

    const downloadResponse = await getArtifactClient().downloadArtifact(name, basedir);

    return downloadResponse.downloadPath;
}

