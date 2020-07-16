CALL db.propertyKeys()
YIELD propertyKey
WITH collect(propertyKey) AS properties
CALL apoc.periodic.iterate(
	"MATCH (n:Node) RETURN n",
	"WITH collect(n) AS nodes         CALL apoc.create.removeProperties(nodes, $properties)         YIELD node         RETURN count(*)",
	   {params: {properties: properties}})