CREATE MIGRATION m1ggrikpbx25e7fg5h4fxqx4l2uwsvxox5ly2pr5wodfdtqgsfdk5a
    ONTO initial
{
  CREATE TYPE default::ArtistInfo {
      CREATE REQUIRED PROPERTY mbid: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY name: std::str;
  };
  CREATE TYPE default::TrackArtist {
      CREATE REQUIRED LINK artist: default::ArtistInfo;
      CREATE PROPERTY joinphrase: std::str;
      CREATE REQUIRED PROPERTY name: std::str;
  };
  CREATE TYPE default::TrackRelease {
      CREATE PROPERTY disambiguation: std::str;
      CREATE REQUIRED PROPERTY mbid: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY status: std::str;
      CREATE REQUIRED PROPERTY title: std::str;
  };
  CREATE TYPE default::TrackInfo {
      CREATE REQUIRED MULTI LINK artists: default::TrackArtist;
      CREATE LINK release: default::TrackRelease;
      CREATE PROPERTY artistFull: std::str;
      CREATE PROPERTY coverUrl: std::str;
      CREATE REQUIRED PROPERTY disambiguation: std::str;
      CREATE REQUIRED PROPERTY length: std::int32;
      CREATE REQUIRED PROPERTY mbid: std::str {
          SET readonly := true;
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE MULTI PROPERTY tags: std::str;
      CREATE REQUIRED PROPERTY title: std::str;
  };
};
