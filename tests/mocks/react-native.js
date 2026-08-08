/**
 * Minimal react-native stub used only by the unit-test bundle so that
 * services importing react-native (e.g. ExportService) can be tested in Node.
 */
module.exports = {
  Platform: {
    OS: 'web',
    select: obj => obj.default,
  },
  Share: {
    share: async () => ({ action: 'sharedAction' }),
  },
};
