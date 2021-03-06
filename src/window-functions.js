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

  const getPlaylistInfo = (playlist) => {
    const playlistInfo = {
      bandwidth: playlist.attributes.BANDWIDTH,
      codecs: playlist.attributes.CODECS,
      resolution: playlist.attributes.RESOLUTION,
      targetDuration: playlist.targetDuration,
      segments: []
    };

    const segmentInfoArr = [];

    for (let i = 0; i < playlist.segments.length; i++) {
      const segment = playlist.segments[i];

      if (!playlistInfo.maxDuration || segment.duration > playlistInfo.maxDuration) {
        playlistInfo.maxDuration = segment.duration;
      }
      if (!playlistInfo.minDuration || segment.duration < playlistInfo.minDuration) {
        playlistInfo.minDuration = segment.duration;
      }

      const segmentInfo = {
        duration: segment.duration,
        start: segment.start,
        end: segment.end,
        timeline: segment.timeline,
        resolvedUri: segment.resolvedUri,
        mediaIndex: i
      };

      if (segment.byterange) {
        segmentInfo.byterange = segment.byterange;
      }

      playlistInfo.segments.push(segmentInfo);
    }

    return playlistInfo;
  };

  const addShakaPlayerInfo = (shakaPlayer, playerInfo) => {
    playerInfo.isShaka = true;

    return playerInfo;
  };

  const addDashjsPlayerInfo = (dashjsMediaPlayer, playerInfo) => {
    playerInfo.isDashjs = true;

    return playerInfo;
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
      seekable: timeRangesToArray(player.seekable()),
      src: player.src()
    };
    const vhs = player.tech(true).vhs;

    if (!vhs) {
      if (player.dash && player.dash.shakaPlayer) {
        return addShakaPlayerInfo(player.dash.shakaPlayer, playerInfo);
      }
      if (player.dash && player.dash.mediaPlayer) {
        return addDashjsPlayerInfo(player.dash.mediaPlayer, playerInfo);
      }
      return playerInfo;
    }

    const mpc = vhs.masterPlaylistController_;
    const sourceUpdater = mpc.mainSegmentLoader_.sourceUpdater_;

    playerInfo.sourceBuffers = {};

    if (sourceUpdater.videoBuffer) {
      playerInfo.videoBuffered = timeRangesToArray(sourceUpdater.videoBuffer.buffered);
      playerInfo.sourceBuffers.video = {
        timestampOffset: sourceUpdater.videoBuffer.timestampOffset
      };
    }
    if (sourceUpdater.audioBuffer) {
      playerInfo.audioBuffered = timeRangesToArray(sourceUpdater.audioBuffer.buffered);
      playerInfo.sourceBuffers.audio = {
        timestampOffset: sourceUpdater.audioBuffer.timestampOffset
      };
    }

    const mainSegmentLoader = mpc.mainSegmentLoader_;
    const audioSegmentLoader = mpc.audioSegmentLoader_;
    const mainPlaylist = mainSegmentLoader.playlist_;
    const audioPlaylist = audioSegmentLoader.playlist_;
    const isAudioActive = mpc.mediaTypes_.AUDIO.activePlaylistLoader;

    if (mainPlaylist) {
      playerInfo.mainPlaylist = getPlaylistInfo(mainPlaylist);
    }
    if (isAudioActive && audioPlaylist) {
      playerInfo.audioPlaylist = getPlaylistInfo(audioPlaylist);
    }

    const masterPlaylistLoader = mpc.masterPlaylistLoader_;
    const isDash = mpc.sourceType_ === 'dash';
    const playlistLoaderSrcUrl = masterPlaylistLoader.srcUrl;

    // handle DASH Location updates
    if (masterPlaylistLoader && isDash && playlistLoaderSrcUrl !== playerInfo.src) {
      playerInfo.src = playlistLoaderSrcUrl;
    }

    return playerInfo;
  });
};

export default getFunctionBody(getPlayers);
