module.exports = (sequelize, Sequelize) => {

    const drop = sequelize.query(
        `DROP PROCEDURE IF EXISTS Open_Treasure;`
    , {
        'type': sequelize.QueryTypes.RAW
    });

    const proc = sequelize.query(
        `CREATE PROCEDURE Open_Treasure(IN p_TreasureId INT, IN p_Amount INT, IN p_Latitude DOUBLE, IN p_Longitude DOUBLE,IN p_Email VARCHAR(50))
                BEGIN
                    DECLARE v_moneyvalueid INTEGER;
                    DECLARE v_amount INTEGER;
                    DECLARE v_userid INTEGER;
                    DECLARE v_updated INTEGER DEFAULT 0;
                    DECLARE v_lock INTEGER;
                    DECLARE getlock INTEGER;

                    select IS_FREE_LOCK(p_TreasureId) into v_lock;
                    IF(v_lock = 1)
                    THEN
                        SELECT GET_LOCK(p_TreasureId, 1) into getlock;
                        SELECT moneyvalueid, amount into v_moneyvalueid, v_amount from
                            (SELECT m.id as moneyvalueid, min(m.amt) as amount, t.id, t.name, ( 6371 * acos( cos( radians(p_Latitude) ) * cos( radians( latitude ) ) *
                            cos( radians( longitude ) - radians(p_Longitude) ) + sin( radians(p_Latitude) ) *
                            sin( radians( latitude ) ) ) ) AS distance
                        FROM treasures t, money_values m
                            where t.id = m.treasure_id
                            and m.opened = false
                            group by t.id
                            HAVING  distance < 0.1 ORDER BY distance) t
                        where t.amount = p_Amount order by t.name;
                        select id into v_userid from users where email = p_Email;
                        if(v_moneyvalueid is not null and v_userid is not null)
                        then
                            update money_values set opened = true where id = v_moneyvalueid;
                            update users set points = points + p_Amount where id = v_userid;
                            SET v_updated = 1;
                        end if;
                        SELECT RELEASE_LOCK(p_TreasureId) into getlock;
                    ELSE
                        SET v_updated = 2;
                    END IF;
                     select v_updated as status;
                END;`
    , {
        'type': sequelize.QueryTypes.RAW
    });

    return [drop, proc];
};
