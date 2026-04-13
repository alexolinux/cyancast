FROM debian:bookworm-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    mpv \
    socat \
    pulseaudio \
    && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["mpv", "--idle=yes", "--input-ipc-server=/tmp/mpv/socket/mpv.sock", "--no-video"]
