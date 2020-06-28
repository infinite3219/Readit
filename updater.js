const { autoUpdater } = require("electron-updater")
const { dialog } = require("electron")


autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "debug"
// disable auto download
autoUpdater.autoDownload = false
let updateInProgress = false;

module.exports = () => {
    if (updateInProgress === false) {
        autoUpdater.checkForUpdates();
        updateInProgress = true;
    }
    
    
    autoUpdater.on('update-available', () => {
        dialog.showMessageBox({
            type: 'info',
            title: 'Update available',
            message: 'A new version of Readit is available. Do you want to update now?',
            buttons: ['Update', 'Later']
        }, buttonIndex => {
            if (buttonIndex === 0) {
                autoUpdater.downloadUpdate();
            }
            else {
                updateInProgress = false;
            }
        });
        
    });

    autoUpdater.on('update-not-available', () => {
        updateInProgress = false;
    });

    autoUpdater.on('update-downloaded', () => {
        updateInProgress = false;
        // prompt user to install update
        dialog.showMessageBox({
            type: 'info',
            title: 'Update ready',
            message: 'Install and restart now?',
            buttons: ['Yes', 'Later']
        }, buttonIndex => {
            if (buttonIndex === 0) {
                autoUpdater.quitAndInstall(false, true)
            }
        });
    });


}
