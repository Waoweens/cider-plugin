import { useMusicKit } from './api/MusicKit';
import { useConfig } from './config';

const mk = useMusicKit();
const cfg = useConfig();

let lastPlaying: MusicKit.MediaItem | null;
let paused = false;

export function npSocket(): WebSocket | null {
	const config = cfg.endpoint;
	if (!config) return null;

	const url = config.replace(/^(http|ws)s?\:\/\//gi, '');
	const ws = new WebSocket(`ws://${url}`);

	ws.addEventListener('open', () => {
		console.log(`connected to ws://${url}`);
	});

	ws.addEventListener('message', (event) => {
		console.log('message from server:', event.data);
	});

	return ws;
}

export function npInit(socket: WebSocket | null) {
	if (!socket) return;
	let ws: WebSocket | null = socket;

	mk.addEventListener(
		// @ts-ignore: Undocumented event
		'nowPlayingItemDidChange',
		(event: { item: MusicKit.MediaItem }) => {
			console.log('nowPlayingItemDidChange', event);

			const attr = event.item.attributes;

			if (socket.readyState !== WebSocket.OPEN) ws = npSocket();
			if (ws && event.item !== lastPlaying) {
				console.log('new media item', attr.attributes);

				sendSong(ws, attr);

				lastPlaying = event.item;
			}
		}
	);

	mk.addEventListener('playbackStateDidChange', (event) => {
		console.log('playbackStateDidChange', event);

		const e = event as {
			oldState: MusicKit.PlaybackStates;
			state: MusicKit.PlaybackStates;
			nowPlayingItem: MusicKit.MediaItem;
		};
		const attr = e.nowPlayingItem.attributes;

		console.log(
			'Playback State',
			MusicKit.PlaybackStates[e.state],
			`(${e.state})`
		);

		if (socket.readyState !== WebSocket.OPEN) ws = npSocket();
		if (ws) {
			if (paused && event.state == MusicKit.PlaybackStates.playing) {
				sendSong(ws, attr, attr.currentPlaybackTime);
				paused = false;
			}
			if (
				event.state == MusicKit.PlaybackStates.paused ||
				event.state == MusicKit.PlaybackStates.stopped
			) {
				paused = true;
				console.log('paused');
				send(ws, { clear: true });
				lastPlaying = null;
			}

			if (event.state == MusicKit.PlaybackStates.seeking) {
				console.log('seeking to', attr.currentPlaybackTime);
				send(ws, {
					position: attr.currentPlaybackTime * 1000,
					position_modified: Date.now()
				});
			}
		}
	});
}

function sendSong(socket: WebSocket, attr: any, pos = 0) {
	const data = {
		now_playing: {
			title: attr.name,
			artist: attr.artistName,
			album: attr.albumName,
			artwork: (attr.artwork.url as string)
				.replace('{w}', attr.artwork.width)
				.replace('{h}', attr.artwork.height),
			duration: attr.durationInMillis,
		},
		position: pos * 1000,
		position_modified: Date.now()
	};

	send(socket, data);
}

function send(socket: WebSocket, data: any) {
	if (socket.readyState !== WebSocket.OPEN) {
		console.error('socket not open');
		return;
	}

	socket.send(JSON.stringify(data));

	console.log('sent', data);
}
