# nix/packages.nix — Clawbot Agent package built with uv2nix
{ inputs, ... }:
{
  perSystem =
    { pkgs, inputs', ... }:
    let
      clawbotAgent = pkgs.callPackage ./clawbot-agent.nix {
        inherit (inputs) uv2nix pyproject-nix pyproject-build-systems;
        npm-lockfile-fix = inputs'.npm-lockfile-fix.packages.default;
        # Only embed clean revs — dirtyRev doesn't represent any upstream
        # commit, so comparing it would always claim "update available".
        rev = inputs.self.rev or null;
      };
    in
    {
      packages = {
        default = clawbotAgent;
        tui = clawbotAgent.clawbotTui;
        web = clawbotAgent.clawbotWeb;

        fix-lockfiles = clawbotAgent.clawbotNpmLib.mkFixLockfiles {
          packages = [ clawbotAgent.clawbotTui clawbotAgent.clawbotWeb ];
        };
      };
    };
}
