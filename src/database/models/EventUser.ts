import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo
  } from "sequelize-typescript";
  import User from "./User";
  import Event from "./Event";
  
  @Table({
    timestamps: false,
    tableName: "event_user",
    modelName: "EventUser",
    underscored: true
  })
  class EventUser extends Model {
    @ForeignKey(() => User)
    @Column({
      type: DataType.INTEGER,
    })
    userId: number;
  
    @ForeignKey(() => Event)
    @Column({
      type: DataType.INTEGER,
    })
    eventId: number;
  
    @BelongsTo(() => User)
    user: User;
  
    @BelongsTo(() => Event)
    event: Event;
  }

export default EventUser;