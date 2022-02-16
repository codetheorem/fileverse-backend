const ErrorHandler = require('../../infra/utils/errorHandler');
const { File } = require('../../infra/database/models');
const MoralisService = require('../../infra/utils/moralis');

const moralisService = new MoralisService();

// if token-gated then check balance of user
function setRead({
  fileOwner,
  viewer,
  filePermission,
  viewerAddress,
  fileToken,
}) {
  if (filePermission === 'public') {
    return true;
  }
  if (filePermission === 'unlisted') {
    return true;
  }
  if (filePermission === 'token-gated') {
    const bal = moralisService.getContractBalance({
      address: viewerAddress,
      contractAddress: fileToken.contractAddress,
      tokenType: fileToken.tokenType,
      chain: fileToken.chain,
    });
    return bal >= fileToken.gateBalance;
  }
  return fileOwner.toString() === viewer.toString();
}

function setEdit({ fileOwner, viewer }) {
  if (!fileOwner || !viewer) {
    return false;
  }

  return fileOwner.toString() === viewer.toString();
}

async function permission({ uuid, userId, address }) {
  const file = await File.findOne({ uuid });
  if (!file) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the file by this uuid',
    });
  }
  const permission = {
    read: false,
    edit: false,
  };
  permission.read = setRead({
    fileOwner: file.owner,
    viewer: userId,
    filePermission: file.permission,
    viewerAddress: address,
    fileToken: file.token,
  });
  permission.edit = setEdit({
    fileOwner: file.owner,
    viewer: userId,
    filePermission: file.permission,
  });

  return permission;
}

module.exports = permission;
