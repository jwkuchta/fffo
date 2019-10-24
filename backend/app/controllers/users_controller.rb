class UsersController < ApplicationController
    def index
        users = User.all

        render :json => users.to_json({ :except => [:id, :email, :created_at, :updated_at],
                                        :include => [
                                            :games => { :only => [:score]}
                                        ]})
    end

    def create
        if User.find_by(username: user_params[:username])
            user = User.find_by(username: user_params[:username])
        else
            user = User.new(username: user_params[:username])
        end

        if user.save
            render json: user, status: 200
        else
            render json: user.errors, status: :unprocessble_entity
        end
    end

    private

    def user_params
        params.require(:user).permit(:username)
    end
end