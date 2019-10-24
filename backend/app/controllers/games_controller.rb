class GamesController < ApplicationController
    def index
        games = Game.all

        render json: games
    end

    def create
        new_game = Game.new(score: 0, user_id: params[:user_id][:id])
        if new_game.save
            render json: new_game, status: 200
        else
            render json: new_game.errors, status: :unprocessble_entity
        end
    end

    private

    def game_params
        params.require(:game).permit(:score, :user)
    end
end