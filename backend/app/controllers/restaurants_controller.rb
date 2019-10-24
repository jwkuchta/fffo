class RestaurantsController < ApplicationController
    def index
        restaurants = Restaurant.all

        render :json => restaurants.to_json({ :except => [:created_at, :updated_at], 
                                            :include => [ 
                                                :foods => { :except => [:created_at, :updated_at] }]})
    end
end