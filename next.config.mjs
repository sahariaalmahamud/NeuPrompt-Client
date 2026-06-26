/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
      protocol: "https",
      hostname: "i.ibb.co",
      pathname: "**",
    },
    {
      protocol: "https",
      hostname: "i.ibb.co.com",
      pathname: "**",
    },
    ],
  },
};

export default nextConfig;


// serverExternalPackages: [
//     "@better-auth/kysely-adapter",
//   ],