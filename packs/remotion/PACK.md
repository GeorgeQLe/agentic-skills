# Remotion Pack

Project-local workflows for turning YouTube or creator-media research into Remotion-ready production artifacts.

Install this pack when a project needs format breakdowns for motion/video production, scene-by-scene scripts, or Remotion build specifications and scaffolded project directories.

Default flow:

```text
youtube-format-research -> video-script -> video-build
```

`youtube-format-research` can start from an external reference video and produce a production-pattern handoff. `video-script` turns approved creator-media strategy, series, product-led media, or format research into a sourced scene-by-scene script. `video-build` turns an approved script into a Remotion build specification, component plan, asset manifest, render configuration, and scaffold.

The broader `creator-media` pack remains responsible for evidence capture, positioning, programming, product-led media strategy, packaging, portfolio, cadence, competitive, and metrics review work. Install both packs when a project needs the full path from creator strategy to Remotion production:

```bash
scripts/pack.sh install creator-media remotion
```

**Primary role:** Both — Claude-orchestration for production planning and critique; Codex-execution for scaffold, artifact updates, validation, and shipping.
