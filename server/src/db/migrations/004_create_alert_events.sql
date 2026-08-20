CREATE TABLE alert_events (

    alert_id INTEGER NOT NULL
        REFERENCES alerts(id)
        ON DELETE CASCADE,

    log_event_id INTEGER NOT NULL
        REFERENCES log_events(id)
        ON DELETE CASCADE,

    PRIMARY KEY (alert_id, log_event_id)

);