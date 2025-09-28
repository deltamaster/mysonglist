async function list() {
  const query = `
      {
        songs(first: 10000) {
          items {
            id
            name
            singers
          }
        }
      }`;
      
  const endpoint = "/data-api/graphql";
  const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query })
  });
  const result = await response.json();
  console.log(`Total songs: ${result.data.songs.items.length}`);
  console.table(result.data.songs.items);
}
list();