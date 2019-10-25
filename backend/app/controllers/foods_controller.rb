class FoodsController < ApplicationController
    def index
        foods = Food.all

        render :json => foods.to_json({ :except => [:created_at, :updated_at],
                                        :include => [
                                            :restaurant => { :only => [:name]}
                                        ]
                                        })
    end
end