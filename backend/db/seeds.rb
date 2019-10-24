Restaurant.destroy_all
Food.destroy_all

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



def restaurant_scraper
  url = "https://fastfoodnutrition.org"

  @restaurants.each do |restaurant|
    thisRestaurant = Restaurant.create(name: restaurant[:name])

    unparsed = HTTParty.get(url + restaurant[:route])
    parsed = Nokogiri::HTML(unparsed)

    unparsed_foods = parsed.css('div.filter_target')
    unparsed_foods.each do |unparsed_food|
      parsed_food = unparsed_food.text

      if parsed_food.split(' Nutrition Facts').last.include? "-"
        # finds the average calories if given a range (i.e. 500-750 calories)
        calorie_range = parsed_food.split(' Nutrition Facts').last.split(' ').first.split('-').map {|num| num.to_i}
        final_calories = calorie_range.sum/2
      else
        final_calories = parsed_food.split(' Nutrition Facts').last.split(' calories').last.to_i
      end

      if final_calories > 350
        # dismisses foods with calories less than 350
        food = {
          name: parsed_food.split(' Nutrition Facts').first,
          image: nil,
          calories: final_calories
        }
        restaurant[:foods] << food
        Food.create(name: food[:name], image: food[:image], calories: food[:calories], restaurant_id: thisRestaurant.id)
      end
    end
  end
end

restaurant_scraper