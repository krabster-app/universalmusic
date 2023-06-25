CREATE MIGRATION m1azozhem2dpttg2goapyhsqkzu5cl4u2odgw6if4ozuriotq6uy6q
    ONTO m1ewsierbhl2wfa2lmoqpw36woztldtdhg5cdnbio6l3c2yegddqua
{
  ALTER TYPE default::ArtistInfo {
      ALTER PROPERTY mbid {
          SET TYPE std::uuid USING (<std::uuid>.mbid);
      };
  };
  ALTER TYPE default::TrackInfo {
      ALTER PROPERTY mbid {
          SET TYPE std::uuid USING (<std::uuid>.mbid);
      };
  };
  ALTER TYPE default::TrackRelease {
      ALTER PROPERTY mbid {
          SET TYPE std::uuid USING (<std::uuid>.mbid);
      };
  };
};
