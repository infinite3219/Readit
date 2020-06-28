const { autoUpdater } = require("electron-updater")
const { dialog } = require("electron")


autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "debug"
// disable auto download
autoUpdater.autoDownload = false

module.exports = () => {
    autoUpdater.checkForUpdates();
    
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
        });
        
    });

    autoUpdater.on('update-downloaded', () => {
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
