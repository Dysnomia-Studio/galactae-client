cp config/config.php config.php

sed -i "s/getenv('GALACTAE_SQL_SERVER')/\"$GALACTAE_SQL_SERVER\"/" config.php
sed -i "s/getenv('GALACTAE_SQL_DATABASE')/\"$GALACTAE_SQL_DATABASE\"/" config.php
sed -i "s/getenv('GALACTAE_SQL_USERNAME')/\"$GALACTAE_SQL_USERNAME\"/" config.php
sed -i "s/getenv('GALACTAE_SQL_PASSWORD')/\"$GALACTAE_SQL_PASSWORD\"/" config.php

cp app/views/gvars/gvars.php app/views/gvars.php

sed -i "s/getenv('GALACTAE_01_SQL_SERVER')/\"$GALACTAE_01_SQL_SERVER\"/" app/views/gvars.php
sed -i "s/getenv('GALACTAE_01_SQL_DATABASE')/\"$GALACTAE_01_SQL_DATABASE\"/" app/views/gvars.php
sed -i "s/getenv('GALACTAE_01_SQL_USERNAME')/\"$GALACTAE_01_SQL_USERNAME\"/" app/views/gvars.php
sed -i "s/getenv('GALACTAE_01_SQL_PASSWORD')/\"$GALACTAE_01_SQL_PASSWORD\"/" app/views/gvars.php

chown www-data:www-data config.php
chown www-data:www-data app/views/gvars.php
