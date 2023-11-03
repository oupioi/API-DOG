import {
    Table,
    Column,
    Model,
    DataType
} from "sequelize-typescript";

@Table({
    timestamps: false,
    tableName: "address",
    modelName: "Address"
})
class Address extends Model
{
    @Column({
        primaryKey: true,
        type: DataType.INTEGER,
        autoIncrement: true
    })
    declare id: number;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare address: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare zipCode: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare city: string;

}

export default Address;
