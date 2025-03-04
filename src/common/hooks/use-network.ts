import { useCallback } from 'react';
import {
  customNetworksListState,
  networkIndexState,
  networkListState,
} from '@store/recoil/network';
import { DEFAULT_TESTNET_INDEX, DEFAULT_MAINNET_INDEX } from '@common/constants';
import { networkSwitchingState } from '@store/recoil/network';
import { useAtomCallback, useAtomValue, useUpdateAtom } from 'jotai/utils';
import { useAtom } from 'jotai';

export const useNetwork = () => {
  const setNetworkList = useUpdateAtom(customNetworksListState);
  const networkList = useAtomValue(networkListState);
  const [currentNetworkIndex, setIndex] = useAtom(networkIndexState);
  const [networkSwitching, setNetworkSwitching] = useAtom(networkSwitchingState);

  const handleSetPendingChange = () => {
    console.log('set pending');
    setNetworkSwitching('pending');
  };

  const handleAddListItem = useCallback(
    (item: { label: string; url: string }) =>
      setNetworkList(list => {
        const networkListSet = new Set(list);
        networkListSet.add(item);
        return [...networkListSet];
      }),
    []
  );

  const handleRemoveListItem = useCallback(
    (item: { label: string; url: string }) =>
      setNetworkList(list => {
        const networkListSet = new Set(list);
        networkListSet.delete(item);
        return [...networkListSet];
      }),
    []
  );

  const handleUpdateCurrentIndex = useAtomCallback<void, number>(
    useCallback((get, set, arg) => {
      set(networkSwitchingState, 'pending');
      set(networkIndexState, arg);
      setTimeout(() => {
        window.location.reload(true);
      }, 1000);
    }, [])
  );

  const handleAddNetwork = useCallback(
    (item: { label: string; url: string }) => {
      handleAddListItem(item);
      void handleUpdateCurrentIndex(networkList.length);
    },
    [networkList, handleAddListItem, handleUpdateCurrentIndex]
  );

  const handleRemoveNetwork = useCallback(
    (item: { label: string; url: string }) => {
      handleRemoveListItem(item);
    },
    [handleRemoveListItem]
  );

  const handleSetTestnet = useCallback(() => {
    void handleUpdateCurrentIndex(DEFAULT_TESTNET_INDEX);
  }, [handleUpdateCurrentIndex]);

  const handleSetMainnet = useCallback(() => {
    void handleUpdateCurrentIndex(DEFAULT_MAINNET_INDEX);
  }, [handleUpdateCurrentIndex]);

  const isSwitching = networkSwitching === 'pending';

  return {
    networkList,
    setNetworkList,
    currentNetworkIndex,
    setIndex,
    isSwitching,
    handleAddListItem,
    handleUpdateCurrentIndex,
    handleSetTestnet,
    handleSetMainnet,
    handleAddNetwork,
    handleRemoveNetwork,
    handleSetPendingChange,
  };
};
