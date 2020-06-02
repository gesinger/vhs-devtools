export const getFunctionBody = (func) => {
  const funcString = func.toString();

  return `
    (() => {
      ${funcString.substring(funcString.indexOf("{") + 1, funcString.lastIndexOf("}"))}
    })();
  `;
};

export const getPlayers = () => {
  const timeRangesToArray = (timeRanges) => {
    const timeRangesList = [];

    for (let i = 0; i < timeRanges.length; i++) {
      timeRangesList.push({
        start: timeRanges.start(i),
        end: timeRanges.end(i)
      });
    }

    return timeRangesList;
  };

  if (!window || !window.videojs || !window.videojs.players) {
    return {};
  }

  return Object.keys(window.videojs.players).map((playerId) => {
    const player = window.videojs.players[playerId];
    const playerInfo = {
      id: playerId,
      currentTime: player.currentTime(),
      duration: player.duration(),
      buffered: timeRangesToArray(player.buffered()),
      seekable: timeRangesToArray(player.seekable())
    };

    if (!player.vhs) {
      return playerInfo;
    }

    const mpc = player.vhs.masterPlaylistController_;
    const sourceUpdater = mpc.mainSegmentLoader_.sourceUpdater_;

    if (sourceUpdater.videoBuffer) {
      playerInfo.videoBuffered = timeRangesToArray(sourceUpdater.videoBuffer.buffered);
    }
    if (sourceUpdater.audioBuffer) {
      playerInfo.audioBuffered = timeRangesToArray(sourceUpdater.audioBuffer.buffered);
    }

    const masterPlaylistLoader = mpc.masterPlaylistLoader_;
    const media = masterPlaylistLoader.media();

    if (media) {
      playerInfo.selectedPlaylist = {
        bandwidth: media.attributes.BANDWIDTH,
        codecs: media.attributes.CODECS,
        resolution: media.attributes.RESOLUTION
      };
    }

    return playerInfo;
  });
};

export default getFunctionBody(getPlayers);
