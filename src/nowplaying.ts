import { useMusicKit } from './api/MusicKit';
import { useCider } from './api/Std';
import { useConfig } from './config';

// fix broken types

const mk = useMusicKit();
const cfg = useConfig();

const username = useCider().config.getRef().general.displayName;

let lastPlaying: MusicKit.MediaItem | null;

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

	mk.addEventListener('playbackStateDidChange', (event) => {
		console.log('playbackStateDidChange', event);
		console.log('Playback State', MusicKit.PlaybackStates[event.state], `(${event.state})`);

		// @ts-ignore: types are broken here
		const np: MusicKit.MediaItem = event.nowPlayingItem;

		if (socket.readyState !== WebSocket.OPEN) ws = npSocket();

		if (ws) {
			if (event.state == MusicKit.PlaybackStates.playing && np !== lastPlaying) {
				console.log('new media item', np);
	
				const data = {
					username,
					now_playing: {
						title: np.attributes.name,
						artist: np.attributes.artistName,
						album: np.attributes.albumName,
						artwork: (np.attributes.artwork.url as string)
							.replace('{w}', np.attributes.artwork.width)
							.replace('{h}', np.attributes.artwork.height),
					},
				};
				
				send(ws, data);
	
				lastPlaying = np;
			}
	
			if (event.state == MusicKit.PlaybackStates.paused) {
				console.log('paused');
				send(ws, emptyData());
				lastPlaying = null;
			}
		}
	});
}

function send(socket: WebSocket, data: any) {
	if (socket.readyState !== WebSocket.OPEN) {
		console.error('socket not open');
		return;
	}

	socket.send(JSON.stringify(data));

	console.log('sent', data);
}

function emptyData() {
	return {
		username,
		now_playing: {
			title: '',
			artist: '',
			album: '',
			artwork: '',
		},
	};
}
