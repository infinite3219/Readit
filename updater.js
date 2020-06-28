const { autoUpdater } = require("electron-updater")
const { dialog } = require("electron")
const log = require('electron-log');
const kNoUpdateInProgress = 0
const kUpdateCheckInProgress = 1
const kDownloadInProgress = 2
const kQuitAndInstall = 3;

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = "debug"
// disable auto download
autoUpdater.autoDownload = false
let updateInProgress = kNoUpdateInProgress;

module.exports = () => {
    if (updateInProgress === kNoUpdateInProgress) {
        log.info(`LOG: Checking for updates updateInProgress = ${updateInProgress}`)
        autoUpdater.checkForUpdates();
        updateInProgress = kUpdateCheckInProgress;
    }
    autoUpdater.on('error', (err) => {
        log.info(`LOG: Error encountered ${JSON.stringify(err)}, updateInProgress = ${updateInProgress}`)
        updateInProgress = kNoUpdateInProgress;
    });
    
    autoUpdater.on('update-available', (updateInfo) => {
        log.info(`LOG: Update Available updateInProgress = ${updateInProgress}, update Info = ${JSON.stringify(updateInfo)}`)
        if (updateInProgress !== kUpdateCheckInProgress) {
            log.info(`LOG: Update Available, but not proper state updateInProgress = ${updateInProgress}`)
            return
        }
        updateInProgress = kDownloadInProgress
        dialog.showMessageBox({
            type: 'info',
            title: 'Update available',
            message: 'A new version of Readit is available. Do you want to update now?',
            buttons: ['Update', 'Later']
        }, buttonIndex => {
            if (buttonIndex === 0) {
                log.info(`LOG: Downloading updates`)
                autoUpdater.downloadUpdate();
            }
            else {
                log.info(`LOG: Canceled updates`)
                updateInProgress = kNoUpdateInProgress
            }
        });
        
    });

    autoUpdater.on('update-not-available', () => {
        log.info(`LOG: Update not available updateInProgress = ${updateInProgress}`)
        updateInProgress = kNoUpdateInProgress
    });

    autoUpdater.on('update-downloaded', () => {
        log.info(`LOG: Update downloaded updateInProgress = ${updateInProgress}`)
        if (updateInProgress !== kDownloadInProgress) {
            log.info(`LOG: Update Downloaded, but not proper state updateInProgress = ${updateInProgress}`)
            return
        }
        updateInProgress = kQuitAndInstall
        // prompt user to install update
        dialog.showMessageBox({
            type: 'info',
            title: 'Update ready',
            message: 'Install and restart now?',
            buttons: ['Yes', 'Later']
        }, buttonIndex => {
            if (buttonIndex === 0) {
                updateInProgress = true;
                log.info(`LOG: Quit and install`)
                autoUpdater.quitAndInstall(false, true)
            }
            else {
                updateInProgress = kNoUpdateInProgress
                log.info(`LOG: Canceled updated for restart`)
            }
        });
    });


}
