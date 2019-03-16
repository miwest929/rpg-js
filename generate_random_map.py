import random

def random_tile_key(max_value):
  keys = [0, 1, 2, 3, 4, 5, 25, 20, 29, 6, 23]
  random_key = random.randint(0, len(keys)-1)
  return str(keys[random_key])

tiles_per_row = 200
num_of_rows = 200
tiles = []
for r in range(0, num_of_rows):
  row = []
  for c in range(0, tiles_per_row):
    row.append(random_tile_key(37))
  tiles.append(row)

tiles_string = []
for tile in tiles:
    tiles_string.append('[' + '{0}'.format(', '.join(tile)) + ']')
all_tiles_string = "[" + ",".join(tiles_string) + "]"

print "{"
print "\"tilemap_key\": \"terrain\","
print "\"width\": {}, \"height\": {}, ".format(tiles_per_row, num_of_rows)
print "\"data\": {}".format(all_tiles_string)
print "}"
