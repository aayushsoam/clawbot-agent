# nix/tui.nix — Clawbot TUI (Ink/React) compiled with tsc and bundled
{ pkgs, clawbotNpmLib, ... }:
let
  src = ../ui-tui;
  npmDeps = pkgs.fetchNpmDeps {
    inherit src;
    hash = "sha256-qGgxHTBJ2mFO2ETMU1Oqe20Kz30kpU97jsSuQ/EoIZA=";
  };

  npm = clawbotNpmLib.mkNpmPassthru { folder = "ui-tui"; attr = "tui"; pname = "clawbot-tui"; };

  packageJson = builtins.fromJSON (builtins.readFile (src + "/package.json"));
  version = packageJson.version;
in
pkgs.buildNpmPackage (npm // {
  pname = "clawbot-tui";
  inherit src npmDeps version;

  doCheck = false;
  npmFlags = [ "--legacy-peer-deps" ];

  installPhase = ''
    runHook preInstall

    mkdir -p $out/lib/clawbot-tui

    # Single self-contained bundle built by scripts/build.mjs (esbuild).
    cp -r dist $out/lib/clawbot-tui/dist

    # package.json kept for "type": "module" resolution on `node dist/entry.js`.
    cp package.json $out/lib/clawbot-tui/

    runHook postInstall
  '';
})
