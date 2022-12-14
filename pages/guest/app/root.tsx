import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/cloudflare";
import styles from "./unocss.css";
import reset from "@unocss/reset/tailwind.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: reset },
    { rel: "stylesheet", href: styles },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    { rel: "manifest", href: "/site.webmanifest" },
  ];
};

export const meta: MetaFunction = () => {
  return {
    title: "1 Project Guest",
    description: "The guest project",
  };
};

export const loader: LoaderFunction = () => {
  const nonce = [...crypto.getRandomValues(new Uint8Array(16))]
    .map((x) => x.toString())
    .join("");

  return nonce;
};

export default function App() {
  const nonce = useLoaderData<string>();

  const ws = process.env.NODE_ENV === "production" ? "" : " connect-src *;";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <meta
          httpEquiv="Content-Security-Policy"
          content={`default-src 'self'; img-src 'self' https: data:; style-src 'unsafe-inline' 'self' https:;${ws} font-src 'self' https:; child-src 'none'; script-src 'unsafe-inline' 'strict-dynamic' 'nonce-${nonce}';`}
        />
      </head>
      <body className="flex flex-col bg-black text-white">
        <Outlet />
        <ScrollRestoration nonce={nonce} />
        <script
          async
          type="module"
          src="https://cdn.jsdelivr.net/npm/@unocss/runtime/uno.global.js"
          nonce={nonce}
        />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}
