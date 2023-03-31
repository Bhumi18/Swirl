import '@/styles/globals.css'
// import type { AppProps } from 'next/app'
import { configureChains, createClient, WagmiConfig } from "wagmi";
import {
  getDefaultWallets, RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { polygonMumbai, goerli, optimismGoerli} from "wagmi/chains";

const { chains, provider } = configureChains(
  [polygonMumbai, goerli, optimismGoerli],
  [
    alchemyProvider({ apiKey: "O5NYvtwLMNG0LjAXPQEk0YJT2l3UxTAY" }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Swirl- an Advertisement on WEB3",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }) {

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
