use anchor_lang::prelude::*;

declare_id!("EPYqwH4n7Eu8n8NAwr1PorvsNJsjLfJDaQ7Q9QXxX8fX");

#[program]
pub mod solstarter {
    use super::*;

    pub fn greet(_ctx: Context<Initialize>) -> Result<()> {
        msg!("GM!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
