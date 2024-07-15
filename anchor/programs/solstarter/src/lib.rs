use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("EPYqwH4n7Eu8n8NAwr1PorvsNJsjLfJDaQ7Q9QXxX8fX");

#[program]
pub mod solstarter {
    use super::*;

    pub fn create_user(
        ctx: Context<CreateUser>,
        name: String,
        bio: String,
        avatar_url: String,
    ) -> Result<()> {
        instructions::create_user(ctx, name, bio, avatar_url)
    }

    pub fn create_project(ctx: Context<CreateProject>) -> Result<()> {
        instructions::create_project(ctx)
    }
}
