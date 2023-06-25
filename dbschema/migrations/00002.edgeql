CREATE MIGRATION m1ewsierbhl2wfa2lmoqpw36woztldtdhg5cdnbio6l3c2yegddqua
    ONTO m1ggrikpbx25e7fg5h4fxqx4l2uwsvxox5ly2pr5wodfdtqgsfdk5a
{
  CREATE SCALAR TYPE default::Platform EXTENDING enum<Youtube, Yandex, VK>;
  CREATE TYPE default::TrackOnPlatform {
      CREATE REQUIRED LINK trackInfo: default::TrackInfo;
      CREATE REQUIRED PROPERTY platform: default::Platform;
      CREATE CONSTRAINT std::exclusive ON ((.platform, .trackInfo));
      CREATE REQUIRED PROPERTY meta: std::json;
  };
  ALTER TYPE default::TrackInfo {
      CREATE MULTI LINK platform: default::TrackOnPlatform;
      CREATE MULTI PROPERTY link: std::str;
  };
};
