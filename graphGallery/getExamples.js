const fs = require('fs');
const axios = require('axios');
const R = require('ramda');

// getAllExamples(require('./source.json'));
const axiosConfig = {
	responseType: 'json',
};

run();

async function run() {
	console.clear();
	const source = getSource();
	let allData = getAllExamples(source);
	allData = await Promise.all(allData);
	let map = getNeoDataMap();
	convertAllToNeo(allData, map);
	processUseCaseAndIndustry(map);
	fs.promises.writeFile('./dist/neoDatas.json', JSON.stringify([...map.values()]));
}

function processUseCaseAndIndustry(map) {
	const examples = [...map.values()]
		.filter(item => item.type = 'example');

	R.forEach(example => {
		if (example.use_cases && example.use_cases.length > 0) {
			R.forEach(useCase => {
				if (!map.has(useCase.id)) {
					useCase.type = 'useCase';
					map.set(useCase.id, useCase);
				}
			})(example.use_cases);
			example.use_cases = R.map(R.prop('name'))(example.use_cases);
		}

		if (example.industries && example.industries.length > 0) {
			R.forEach(industry => {
				if (!map.has(industry.id)) {
					industry.type = 'industry';
					map.set(industry.id, industry);
				}
			})(example.industries);
			example.industries = R.map(R.prop('name'))(example.industries);
		}

		if (example.categories) {
			R.forEach(category => {
				if (!map.has(category.id)) {
					category.type = 'category';
					map.set(category.id, category);
				}
			})(example.categories);
			example.categories = R.map(R.prop('name'))(example.categories);
		}

		const author = example.author;
		if (author) {
			if (!map.has(author.id)) {
				author.type = 'author';
				map.set(author.id, author);
			}
			example.author = author.id;
		}
	})(examples);
}

function getNeoDataMap() {
	return new Map([
		['featured-graphgists', {
			type: 'gallery',
			id: 'featured-graphgists',
			name: 'featured-graphgists'
		}],
		['graph-guides', {
			type: 'gallery',
			id: 'graph-guides',
			name: 'graph-guides'
		}],
		['use-case', {
			type: 'gallery',
			id: 'use-case',
			name: 'use-case'
		}],
		['industry', {
			type: 'gallery',
			id: 'industry',
			name: 'industry'
		}]
	]);
}

function convertAllToNeo(allData, map) {
	R.forEach(source => convertToNeo(source, map))(allData);
}

function convertToNeo(source, map) {
	R.forEach(example => {
		if (!map.has(example.id)) {
			example.type = 'example';
			example.galleries = [];
			map.set(example.id, example);
		}
		map.get(example.id).galleries.push(source.gallery);
	})(source.data);
}

function getAllExamples(source) {
	return R.map(getExamples, source.galleries);
}

async function getExamples(gallery) {
	const response = await axios.get(gallery.src, axiosConfig);
	gallery.data = response.data;
	return gallery;
}

function getSource() {
	return {
		"galleries": [
			{
				"gallery": "featured-graphgists",
				"src": "https://portal.graphgist.org/featured_graphgists.json"
			},
			{
				"gallery": "graph-guides",
				"src": "https://portal.graphgist.org/graph_guides.json"
			},
			{
				"gallery": "use-case",
				"useCase": "graphgist-challenge",
				"src": "https://portal.graphgist.org/graph_gists.json?category=graphgist-challenge"
			},
			// {
			// 	"gallery": "use-case",
			// 	"useCase": "sports-and-recreation",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=sports-and-recreation"
			// },
			// {
			// 	"gallery": "use-case",
			// 	"useCase": "master-data-management",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=master-data-management"
			// },
			// {
			// 	"gallery": "use-case",
			// 	"useCase": "real-time-recommendations",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=real-time-recommendations"
			// },
			// {
			// 	"gallery": "use-case",
			// 	"useCase": "optimization",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=optimization"
			// },
			// {
			// 	"gallery": "use-case",
			// 	"useCase": "fraud-detection",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=fraud-detection"
			// },
			// {
			// 	"gallery": "use-case",
			// 	"useCase": "pop-culture",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=pop-culture"
			// },
			// {
			// 	"gallery": "use-case",
			// 	"useCase": "network-and-it-operations",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=network-and-it-operations"
			// },
			// {
			// 	"gallery": "use-case",
			// 	"useCase": "holidays",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=holidays"
			// },
			// {
			// 	"gallery": "use-case",
			// 	"useCase": "graph-based-search",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=graph-based-search"
			// },
			// {
			// 	"gallery": "use-case",
			// 	"useCase": "general-business",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=general-business"
			// },
			// {
			// 	"gallery": "use-case",
			// 	"useCase": "graph-gist-how-tos",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=graph-gist-how-tos"
			// },
			// {
			// 	"gallery": "use-case",
			// 	"useCase": "data-analysis",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=data-analysis"
			// },
			// {
			// 	"gallery": "use-case",
			// 	"useCase": "public-web-apis",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=public-web-apis"
			// },
			// {
			// 	"gallery": "use-case",
			// 	"useCase": "internet-of-things",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=internet-of-things"
			// },
			// {
			// 	"gallery": "use-case",
			// 	"useCase": "investigative-journalism",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=investigative-journalism"
			// },
			// {
			// 	"gallery": "use-case",
			// 	"useCase": "open-government-data-and-politics",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=open-government-data-and-politics"
			// },
			// {
			// 	"gallery": "use-case",
			// 	"useCase": "identity-and-access-management",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=identity-and-access-management"
			// },
			{
				"gallery": "industry",
				"industry": "finance",
				"src": "https://portal.graphgist.org/graph_gists.json?category=finance"
			},
			// {
			// 	"gallery": "industry",
			// 	"industry": "education",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=education"
			// },
			// {
			// 	"gallery": "industry",
			// 	"industry": "sports-and-gaming",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=sports-and-gaming"
			// },
			// {
			// 	"gallery": "industry",
			// 	"industry": "computer-science-and-programming",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=computer-science-and-programming"
			// },
			// {
			// 	"gallery": "industry",
			// 	"industry": "retail",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=retail"
			// },
			// {
			// 	"gallery": "industry",
			// 	"industry": "health-care-and-science",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=health-care-and-science"
			// },
			// {
			// 	"gallery": "industry",
			// 	"industry": "manufacturing",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=manufacturing"
			// },
			// {
			// 	"gallery": "industry",
			// 	"industry": "science",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=science"
			// },
			// {
			// 	"gallery": "industry",
			// 	"industry": "transportation-and-logistics",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=transportation-and-logistics"
			// },
			// {
			// 	"gallery": "industry",
			// 	"industry": "web-amp-social",
			// 	"src": "https://portal.graphgist.org/graph_gists.json?category=web-amp-social"
			// }
		]
	};
}