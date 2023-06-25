module default {
    scalar type Platform extending enum<
        Youtube,
        Yandex,
        VK,
    >;

    type TrackInfo {
        required mbid: uuid {
            constraint exclusive;
            readonly := true;
        }
        required title: str;
        required length: int32;
        required disambiguation: str;
        required multi artists: TrackArtist;
        artistFull: str;
        coverUrl: str; # http://coverartarchive.org/release/{MBID}/front-##(250/500/1200)
        release: TrackRelease;
        multi tags: str;
        multi platform: TrackOnPlatform;
        multi link: str;
    }

    type TrackOnPlatform {
        required platform: Platform;
        required trackInfo: TrackInfo;
        required meta: json;

        constraint exclusive on ((.platform, .trackInfo));
    }

    type TrackArtist {
        joinphrase: str;
        required name: str;
        required artist: ArtistInfo;
    }

    type ArtistInfo {
        required mbid: uuid {
            constraint exclusive;
        }
        required name: str;   
    }

    type TrackRelease {
        required mbid: uuid {
            constraint exclusive;
        }
        required title: str;
        required status: str;
        disambiguation: str;
    }
}
