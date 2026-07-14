# nix/web.nix — Clawbot Web Dashboard (Vite/React) frontend build
{ pkgs, clawbotNpmLib, ... }:
let
  src = ../web;
  npmDeps = pkgs.fetchNpmDeps {
    inherit src;
    hash = "sha256-S2NCYmh2A5PknWaztWJQ+PM8/b6AGyBRSec+Y+CJEdo=";
  };

  npm = clawbotNpmLib.mkNpmPassthru { folder = "web"; attr = "web"; pname = "clawbot-web"; };

  packageJson = builtins.fromJSON (builtins.readFile (src + "/package.json"));
  version = packageJson.version;
in
pkgs.buildNpmPackage (npm // {
  pname = "clawbot-web";
  inherit src npmDeps version;

  doCheck = false;

  buildPhase = ''
    npx tsc -b
    npx vite build --outDir dist
  '';

  installPhase = ''
    runHook preInstall
    cp -r dist $out
    runHook postInstall
  '';
})
