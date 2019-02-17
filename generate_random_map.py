import random

def random_tile_key(max_value):
  return str(random.randint(0, max_value))

tiles_per_row = 400
num_of_rows = 400
tiles = []
for r in range(0, num_of_rows):
  row = []
  for c in range(0, tiles_per_row):
    row.append(random_tile_key(18))
  tiles.append(row)

tiles_string = []
for tile in tiles:
    tiles_string.append('[' + '"{0}"'.format('", "'.join(tile)) + ']')
all_tiles_string = "[" + ",".join(tiles_string) + "]"

print "{"
print "\"tilemap_key\": \"terrain\","
print "\"width\": {}, \"height\": {}, ".format(tiles_per_row, num_of_rows)
print "\"data\": {}".format(all_tiles_string)
print "}"
