import { 
    BelongsTo, 
    Column, 
    DataType, 
    ForeignKey, 
    Table,
    Model
} from "sequelize-typescript";
import Address from "./Address";
import { BelongsToSetAssociationMixin, NonAttribute } from "sequelize";

@Table({
    timestamps: false,
    tableName: "park",
    modelName: "Park",
    underscored: true
})
class Park extends Model 
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
    declare name: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    declare topography: boolean;

    @ForeignKey(() => Address)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idAddress: number;

    @BelongsTo(() => Address, {
        onDelete: "CASCADE"
    })
    declare address: NonAttribute<Address>;

    declare setAddress: BelongsToSetAssociationMixin<Address, Park['idAddress']>;
}

export default Park;