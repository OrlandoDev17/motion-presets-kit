import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useState,
} from "react";

interface ReplayApi {
	epoch: number;
	bump: () => void;
}

const ReplayContext = createContext<ReplayApi>({ epoch: 0, bump: () => {} });

export function ReplayProvider({ children }: { children: ReactNode }) {
	const [epoch, setEpoch] = useState(0);
	const bump = useCallback(() => setEpoch((value) => value + 1), []);
	return (
		<ReplayContext.Provider value={{ epoch, bump }}>
			{children}
		</ReplayContext.Provider>
	);
}

export function useReplay(): ReplayApi {
	return useContext(ReplayContext);
}

export function usePlay(): {
	play: number;
	replay: () => void;
	replayAll: () => void;
} {
	const { epoch, bump } = useReplay();
	const [nonce, setNonce] = useState(0);
	const replay = useCallback(() => setNonce((value) => value + 1), []);
	return { play: nonce + epoch, replay, replayAll: bump };
}
