const cron = require('node-cron');

function scheduleCrons() {
    cron.schedule('*/10 * * * *', async () => {
        const { BookingService } = require('../../services');
        await BookingService.cancelOldBookings();
    });
}
module.exports = scheduleCrons;