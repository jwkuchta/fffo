require 'nokogiri'
require 'httparty'
require 'byebug'

@restaurants = [
  {
    name: "Arby's",
    route: "/arbys",
    foods: []
  },
  {
    name: "Burger King",
    route: "/burger-king",
    foods: []
  },
  {
    name: "Dairy Queen",
    route: "/dairy-queen",
    foods: []
  },
  {
    name: "Five Guys",
    route: "/five-guys",
    foods: []
  },
  {
    name: "In-N-Out Burger",
    route: "/in-n-out-burger",
    foods: []
  },
  {
    name: "Jack in the Box",
    route: "/jack-in-the-box",
    foods: []
  },
  {
    name: "KFC",
    route: "/kfc",
    foods: []
  },
  {
    name: "McDonald's",
    route: "/mcdonalds",
    foods: []
  },
  {
    name: "Panda Express",
    route: "/panda-express",
    foods: []
  },
  {
    name: "Popeyes",
    route: "/popeyes",
    foods: []
  },
  {
    name: "Smashburger",
    route: "/smashburger",
    foods: []
  },
  {
    name: "Sonic",
    route: "/sonic",
    foods: []
  },
  {
    name: "Subway",
    route: "/subway",
    foods: []
  },
  {
    name: "Taco Bell",
    route: "/taco-bell",
    foods: []
  },
  {
    name: "Wendy's",
    route: "/wendys",
    foods: []
  },
  {
    name: "Zaxby's",
    route: "/zaxbys",
    foods: []
  },
]

def scraper
  url = "https://fastfoodnutrition.org"

  @restaurants.each do |restaurant|
    unparsed = HTTParty.get(url + restaurant[:route])
    parsed = Nokogiri::HTML(unparsed)

    unparsed_foods = parsed.css('div.filter_target')
    unparsed_foods.each do |unparsed_food|
    parsed_food = unparsed_food.text
    food = {
      name: parsed_food.split(' Nutrition Facts').first,
      image: nil,
      # TODO: Remove foods with less than 350 calories
      # TODO: 960-1180 calories (accept average, round to 0)
      calories: parsed_food.split(' Nutrition Facts').last.split(' calories').last.to_i
    }
    restaurant[:foods] << food
    end
  end

end

scraper
