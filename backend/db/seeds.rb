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
    name: "Five Guys",
    route: "/five-guys",
    foods: []
  },
  {
    name: "Jack in the Box",
    route: "/jack-in-the-box",
    foods: []
  },
  {
    name: "McDonald's",
    route: "/mcdonalds",
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
  }
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
        # dismisses foods that have less than 350 calories
        food = {
          name: parsed_food.split(' Nutrition Facts').first,
          image: nil,
          calories: final_calories
        }

        # removes trademark symbols from food names
        if food[:name].match? "\u2122"
          food[:name].gsub!("\u2122", "")
        end
        if food[:name].match? "\u2013"
          food[:name].gsub!("\u2013", "")
        end
        if food[:name].match? "\u2019"
          food[:name].gsub!("\u2019", "")
        end
        if food[:name].match? "\u00AE"
          food[:name].gsub!("\u00AE", "")
        end
        if food[:name].match? "\u0303"
          food[:name].gsub!("\u0303", "")
        end
        if food[:name].match? "\u00E9"
          food[:name].gsub!("\u00E9", "")
        end

        restaurant[:foods] << food
        Food.create(name: food[:name], image: food[:image], calories: food[:calories], restaurant_id: thisRestaurant.id)
      end
    end
  end
end

def image_scraper
  url_start = "https://images.search.yahoo.com/search/images;_ylt=AwrExdwRorBdg3gAp8WLuLkF;_ylc=X1MDOTYwNTc0ODMEX3IDMgRmcgMEZ3ByaWQDbUZtMnUxSnpRR09EcUJmc1Y4WE96QQRuX3N1Z2cDMARvcmlnaW4DaW1hZ2VzLnNlYXJjaC55YWhvby5jb20EcG9zAzAEcHFzdHIDBHBxc3RybAMEcXN0cmwDMjYEcXVlcnkDQXJieSdzJTIwQXJieS1RJTIwU2FuZHdpY2gEdF9zdG1wAzE1NzE4NTY5MzI-?fr2=sb-top-images.search&p="
  url_end = "&ei=UTF-8&iscqry=&fr=sfp"

  @restaurants.each do |restaurant|
    restaurant_name = restaurant[:name]
    this_restaurant = Restaurant.find_by(name: restaurant_name)

    if restaurant_name.include? " "
      # replaces spaces in restaurant names with '+'
      restaurant_name = restaurant_name.split(' ').join('+')
    end

    # appends '+' to end of restaurant name
    restaurant_name = "#{restaurant_name}+"

    food_counter = 0

    restaurant[:foods].each do |food|
      food_name = food[:name]
      this_food = this_restaurant.foods.find_by(name: food_name)
      if food_name.include? " "
        # replaces spaces in food names with '+'
        food_name = food_name.split(' ').join('+')
      end

      search_url = url_start+restaurant_name+food_name+url_end
      # remove any apostrophes in names
      search_url = search_url.delete("'")
      unparsed = HTTParty.get(search_url)
      parsed = Nokogiri::HTML(unparsed)

      # disambiguates repetitive browsing patterns
      sleep rand(1..3)

      this_food[:image] = parsed.css("img").first.values.first

      food_counter += 1
      puts "+#{food_counter} #{food[:name]} – #{restaurant[:name]}"
      this_food.save
    end
  end
end

restaurant_scraper
image_scraper