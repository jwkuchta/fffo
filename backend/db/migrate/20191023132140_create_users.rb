class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :username
      t.string :email
      t.integer :weight
      t.integer :height
      t.string :gender
      t.string :activity

      t.timestamps
    end
  end
end
